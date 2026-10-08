import { useEffect, useMemo, useState } from "react";
import SectionHead from "./SectionHead";

const IMAGES_PER_PAGE = 24;

const GALLERIES = {
  wedding: {
    label: "Wedding",
    directory: "wedding",
  },
};

const thumbnailImages = import.meta.glob(
  "../../image/wedding/thumbnails/*.webp",
  {
    query: "?url",
    import: "default",
  }
);

const fullImages = import.meta.glob(
  "../../image/wedding/full/*.webp",
  {
    query: "?url",
    import: "default",
  }
);

const buildImages = (gallery) => {
  const { directory } = GALLERIES[gallery];
  const prefix = `../../image/${directory}/thumbnails/`;

  return Object.keys(thumbnailImages)
    .filter((key) => key.startsWith(prefix))
    .sort((a, b) => {
      const aId = Number(a.slice(prefix.length).replace(".webp", ""));
      const bId = Number(b.slice(prefix.length).replace(".webp", ""));

      return aId - bId;
    })
    .map((thumbKey) => {
      const filename = thumbKey.slice(prefix.length);

      return {
        id: Number(filename.replace(".webp", "")),
        thumbKey,
        fullKey: `../../image/${directory}/full/${filename}`,
      };
    });
};

export default function Gallery() {
  const [activeGallery, setActiveGallery] = useState("wedding");
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumnCount(2);
      } else if (window.innerWidth < 768) {
        setColumnCount(3);
      } else if (window.innerWidth < 1024) {
        setColumnCount(4);
      } else {
        setColumnCount(6);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const allImages = useMemo(
    () => buildImages(activeGallery),
    [activeGallery]
  );

  const visibleImages = allImages.slice(0, visibleCount);
  const allLoaded = visibleCount >= allImages.length;

  useEffect(() => {
    setVisibleCount(IMAGES_PER_PAGE);
    setLoadedImages({});
    setImageSizes({});
  }, [activeGallery]);

  useEffect(() => {
    let cancelled = false;

    const loadVisibleImages = async () => {
      const missingImages = visibleImages.filter(
        (image) => !loadedImages[image.thumbKey]
      );

      if (!missingImages.length) return;

      const results = await Promise.all(
        missingImages.map(async (image) => {
          const loader = thumbnailImages[image.thumbKey];

          if (!loader) return null;

          try {
            const url = await loader();

            return new Promise((resolve) => {
              const img = new Image();

              img.onload = () =>
                resolve({
                  image,
                  url,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });

              img.onerror = () =>
                resolve({
                  image,
                  url,
                  width: 0,
                  height: 0,
                });

              img.src = url;
            });
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const nextImages = {};
      const nextSizes = {};

      results.filter(Boolean).forEach(
        ({ image, url, width, height }) => {
          nextImages[image.thumbKey] = url;

          if (width && height) {
            nextSizes[image.thumbKey] = {
              width,
              height,
            };
          }
        }
      );

      if (Object.keys(nextImages).length) {
        setLoadedImages((current) => ({
          ...current,
          ...nextImages,
        }));
      }

      if (Object.keys(nextSizes).length) {
        setImageSizes((current) => ({
          ...current,
          ...nextSizes,
        }));
      }
    };

    loadVisibleImages();

    return () => {
      cancelled = true;
    };
  }, [visibleCount, activeGallery]);

  const columns = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);

    const containerWidth = 1400;
    const gap = 4;

    const columnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;

    visibleImages.forEach((image) => {
      const size = imageSizes[image.thumbKey];

      let estimatedHeight = columnWidth;

      if (size?.width && size?.height) {
        estimatedHeight =
          columnWidth * (size.height / size.width);
      }

      let shortestColumn = 0;

      for (let i = 1; i < columnCount; i++) {
        if (
          columnHeights[i] <
          columnHeights[shortestColumn]
        ) {
          shortestColumn = i;
        }
      }

      result[shortestColumn].push(image);

      columnHeights[shortestColumn] +=
        estimatedHeight + gap;
    });

    return result;
  }, [visibleImages, imageSizes, columnCount]);

  const handleLoadMore = () => {
    setVisibleCount((current) =>
      Math.min(
        current + IMAGES_PER_PAGE,
        allImages.length
      )
    );
  };

  const handleCollapse = () => {
    setVisibleCount(IMAGES_PER_PAGE);

    document.getElementById("gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openImage = async (image) => {
    const loader = fullImages[image.fullKey];

    if (!loader) {
      console.error(`Wedding image is missing: ${image.fullKey}`);
      return;
    }

    try {
      const fullUrl = await loader();
      setSelectedImage(fullUrl);
    } catch (error) {
      console.error(`Failed to load wedding image: ${image.fullKey}`, error);
    }
  };

  useEffect(() => {
    if (!selectedImage) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedImage]);

  return (
    <section
      id="gallery"
      className="px-4 sm:px-6 lg:px-[6vw] py-16 scroll-mt-24"
    >
      <SectionHead
        kicker="Moments That Last Forever"
        title="Our Best Moments"
      />

      {/* Gallery Pills */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-10">
        <button
          type="button"
          aria-pressed={activeGallery === "wedding"}
          onClick={() => setActiveGallery("wedding")}
          className={`relative min-h-11 overflow-hidden px-2 sm:px-4 py-2 sm:tracking-[2px] rounded-full border font-script uppercase text-[12.5px] transition-all duration-300 tracking-widest ${
            activeGallery === "wedding"
              ? "bg-[#c55a9c] border-[#4A2F22] text-[#F5DFA7] shadow-[0_8px_24px_rgba(91,58,41,0.35)]"
              : "bg-[#FBF4E7] border-[#8A6048] text-[#5B3A29] hover:bg-[#EAD8BD]"
          }`}
        >
          <span className="relative z-10">
            💍 Wedding
          </span>
        </button>

      </div>

      {/* Masonry Gallery */}
      <div className="max-w-[1400px] mx-auto flex gap-1 items-start">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 min-w-0 flex flex-col gap-1"
          >
            {column.map((image) => {
              const src = loadedImages[image.thumbKey];

              return (
                <button
                  type="button"
                  key={image.id}
                  aria-label={`Open wedding memory ${image.id}`}
                  className="relative block w-full overflow-hidden rounded-md bg-gray-100 text-left"
                  onClick={() => openImage(image)}
                >
                  {src && (
                    <img
                      src={src}
                      alt={`${GALLERIES[activeGallery].label} memory ${image.id}`}
                      className="block w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Load More / Collapse */}
      {allImages.length > IMAGES_PER_PAGE && (
        <div className="flex justify-center pt-12 pb-5">
          {!allLoaded ? (
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-full border border-[#8A6048] text-[#5B3A29] font-script tracking-[2px] uppercase text-[12.5px] transition-all duration-300 hover:bg-[#5B3A29] hover:text-[#F5DFA7] hover:shadow-[0_10px_24px_rgba(91,58,41,0.30)]"
            >
              Load More ♥
            </button>
          ) : (
            <button
              onClick={handleCollapse}
              className="px-8 py-3 rounded-full border border-[#8A6048] text-[#5B3A29] font-script tracking-[2px] uppercase text-[12.5px] transition-all duration-300 hover:bg-[#5B3A29] hover:text-[#F5DFA7] hover:shadow-[0_10px_24px_rgba(91,58,41,0.30)]"
            >
              Collapse ♥
            </button>
          )}
        </div>
      )}

      {/* Full Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding photo viewer"
        >
          <div
            className="relative max-w-5xl max-h-[92vh] w-full flex items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              aria-label="Close photo viewer"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white bg-black/50 p-2 sm:p-3 rounded-full hover:bg-black/70 transition z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Selected wedding memory"
              className="object-contain max-h-[88vh] max-w-full rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}