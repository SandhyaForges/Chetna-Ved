import { useEffect, useMemo, useState } from "react";
import SectionHead from "./SectionHead";

const RITUALS = {
  engage: {
    label: "Engagement",
    directory: "Engagement",
  },
  haldi: {
    label: "Haldi",
    directory: "Haldi",
  },
  mehndi: {
    label: "Mehandi",
    directory: "Mehandi",
  },
};

const IMAGES_PER_PAGE = 24;

const thumbnailImages = import.meta.glob(
  "../../image/{Engagement,Haldi,Mehandi}/thumbnails/*.webp",
  {
    query: "?url",
    import: "default",
  }
);

const fullImages = import.meta.glob(
  "../../image/{Engagement,Haldi,Mehandi}/full/*.webp",
  {
    query: "?url",
    import: "default",
  }
);

const buildImages = (ritual) => {
  const { directory } = RITUALS[ritual];
  const prefix = `../../image/${directory}/thumbnails/`;

  return Object.keys(thumbnailImages)
    .filter((key) => key.startsWith(prefix))
    .sort((a, b) => {
      const aId = Number(a.slice(prefix.length).replace(".webp", ""));
      const bId = Number(b.slice(prefix.length).replace(".webp", ""));

      return aId - bId;
    })
    .map((thumbKey) => ({
      id: Number(thumbKey.slice(prefix.length).replace(".webp", "")),
      thumbKey,
      fullKey: `../../image/${directory}/full/${thumbKey.slice(prefix.length)}`,
    }));
};

const getColumnCount = () => {
  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 768) return 3;
  if (window.innerWidth < 1024) return 4;
  return 6;
};

export default function RitualsTimeline() {
  const [activeRitual, setActiveRitual] = useState("engage");
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const [columns, setColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(6);
  const [layoutReady, setLayoutReady] = useState(false);

  const allImages = useMemo(
    () => buildImages(activeRitual),
    [activeRitual]
  );

  const visibleImages = allImages.slice(0, visibleCount);
  const allLoaded = visibleCount >= allImages.length;

  useEffect(() => {
    const updateColumns = () => {
      setColumnCount(getColumnCount());
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  /*
   * Reset everything when switching between Engagement, Haldi and Mehandi.
   */
  useEffect(() => {
    setVisibleCount(IMAGES_PER_PAGE);
    setLoadedImages({});
    setImageSizes({});
    setColumns([]);
    setLayoutReady(false);
  }, [activeRitual]);

  /*
   * Load thumbnails for the currently visible batch.
   */
  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
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

            return {
              image,
              url,
            };
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const newImages = {};
      const newSizes = {};

      await Promise.all(
        results
          .filter(Boolean)
          .map(
            ({ image, url }) =>
              new Promise((resolve) => {
                const img = new Image();

                img.onload = () => {
                  newImages[image.thumbKey] = url;
                  newSizes[image.thumbKey] = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  };
                  resolve();
                };

                img.onerror = () => {
                  newImages[image.thumbKey] = url;
                  resolve();
                };

                img.src = url;
              })
          )
      );

      if (cancelled) return;

      if (Object.keys(newImages).length) {
        setLoadedImages((current) => ({
          ...current,
          ...newImages,
        }));
      }

      if (Object.keys(newSizes).length) {
        setImageSizes((current) => ({
          ...current,
          ...newSizes,
        }));
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [visibleCount, activeRitual]);

  /*
   * Build the masonry layout.
   *
   * Existing images remain in their columns when
   * Load More is clicked. Only the newly added
   * images are distributed.
   */
  useEffect(() => {
    if (!visibleImages.length) return;

    const imagesReady = visibleImages.every(
      (image) =>
        imageSizes[image.thumbKey] ||
        loadedImages[image.thumbKey]
    );

    if (!imagesReady) return;

    const buildLayout = () => {
      const newColumns = Array.from(
        { length: columnCount },
        () => []
      );

      const heights = Array(columnCount).fill(0);

      const containerWidth = 1400;
      const gap = 4;

      const columnWidth =
        (containerWidth - gap * (columnCount - 1)) /
        columnCount;

      visibleImages.forEach((image) => {
        const size = imageSizes[image.thumbKey];

        let estimatedHeight = columnWidth;

        if (size?.width && size?.height) {
          estimatedHeight =
            columnWidth * (size.height / size.width);
        }

        let shortestColumn = 0;

        for (let i = 1; i < columnCount; i++) {
          if (heights[i] < heights[shortestColumn]) {
            shortestColumn = i;
          }
        }

        newColumns[shortestColumn].push(image);
        heights[shortestColumn] += estimatedHeight + gap;
      });

      setColumns(newColumns);
      setLayoutReady(true);
    };

    buildLayout();
  }, [
    activeRitual,
    visibleCount,
    columnCount,
    imageSizes,
    loadedImages,
  ]);

  /*
   * Load More.
   */
  const handleLoadMore = () => {
    if (allLoaded) {
      setVisibleCount(IMAGES_PER_PAGE);

      requestAnimationFrame(() => {
        document.getElementById("rituals")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      return;
    }

    setVisibleCount((current) =>
      Math.min(
        current + IMAGES_PER_PAGE,
        allImages.length
      )
    );
  };

  /*
   * Prevent background scrolling while image viewer is open.
   */
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

  const openImage = async (image) => {
    const loader = fullImages[image.fullKey];

    if (!loader) {
      console.error(`Full-size ritual image is missing: ${image.fullKey}`);
      return;
    }

    try {
      const imageUrl = await loader();
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error(`Failed to load ritual image: ${image.fullKey}`, error);
    }
  };

  return (
    <section
      id="rituals"
      className="px-4 sm:px-6 lg:px-[6vw] py-16 scroll-mt-24"
    >
      <SectionHead
        kicker="Two Days, Unlimited Memories"
        title="Rites of Love"
      />

      {/* Ritual Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-10">
        <button
          type="button"
          aria-pressed={activeRitual === "engage"}
          onClick={() => setActiveRitual("engage")}
          className={`relative min-h-11 overflow-hidden px-2 sm:px-4 py-2 sm:tracking-[2px] rounded-full border font-script uppercase text-[12.5px] transition-all duration-300 ${
            activeRitual === "engage"
              ? "bg-[#C55A9C] border-[#4A2F22] text-[#F5DFA7] shadow-[0_8px_24px_rgba(91,58,41,0.35)]"
              : "bg-[#FBF4E7] border-[#8A6048] text-[#5B3A29] hover:bg-[#EAD8BD]"
          }`}
        >
          <span className="relative z-10">
            💍 Engagement
          </span>
        </button>

        <button
          type="button"
          aria-pressed={activeRitual === "haldi"}
          onClick={() => setActiveRitual("haldi")}
          className={`relative min-h-11 overflow-hidden px-2 sm:px-4 py-2 sm:tracking-[2px] rounded-full border font-script uppercase text-[12.5px] transition-all duration-300 ${
            activeRitual === "haldi"
              ? "bg-[#D9A900] border-[#C49300] text-white shadow-[0_8px_24px_rgba(217,169,0,0.35)]"
              : "bg-[#FFF9DF] border-[#D9A900] text-[#8A6A00] hover:bg-[#F4E7A7]"
          }`}
        >
          <span className="relative z-10">
            🌼 Haldi
          </span>
        </button>

        <button
          type="button"
          aria-pressed={activeRitual === "mehndi"}
          onClick={() => setActiveRitual("mehndi")}
          className={`relative min-h-11 overflow-hidden px-2 sm:px-4 py-2 sm:tracking-[2px] rounded-full border font-script uppercase text-[12.5px] transition-all duration-300 ${
            activeRitual === "mehndi"
              ? "bg-[#5B3A29] border-[#4A2F22] text-[#F5DFA7] shadow-[0_8px_24px_rgba(91,58,41,0.35)]"
              : "bg-[#FBF4E7] border-[#8A6048] text-[#5B3A29] hover:bg-[#EAD8BD]"
          }`}
        >
          <span className="relative z-10">
            🌿 Mehandi
          </span>
        </button>
      </div>

      {/* Height-Aware Masonry Gallery */}
      <div className="max-w-[1400px] mx-auto flex gap-1 items-start">
        {layoutReady &&
          columns.map((column, columnIndex) => (
            <div
              key={`${activeRitual}-${columnIndex}`}
              className="flex-1 min-w-0 flex flex-col gap-1"
            >
              {column.map((image) => {
                const src = loadedImages[image.thumbKey];

                return (
                  <button
                    type="button"
                    key={image.id}
                    aria-label={`Open ${RITUALS[activeRitual].label.toLowerCase()} memory ${image.id}`}
                    className="block w-full overflow-hidden rounded-md bg-gray-200 text-left shadow-[0_10px_24px_rgba(74,47,40,0.12)]"
                    onClick={() => openImage(image)}
                  >
                    {src && (
                      <img
                        src={src}
                        alt={`${RITUALS[activeRitual].label} memory ${image.id}`}
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
          <button
            onClick={handleLoadMore}
            className={`inline-block px-8 py-3 rounded-full border font-script uppercase text-[12.5px] transition-all duration-300 ${
              activeRitual === "haldi"
                ? "border-[#D9A900] text-[#8A6A00] hover:bg-[#D9A900] hover:text-white hover:shadow-[0_10px_24px_rgba(217,169,0,0.30)]"
                : activeRitual === "engage"
                  ? "border-[#C55A9C] text-[#A44782] hover:bg-[#C55A9C] hover:text-white hover:shadow-[0_10px_24px_rgba(197,90,156,0.30)]"
                  : "border-[#8A6048] text-[#5B3A29] hover:bg-[#5B3A29] hover:text-[#F5DFA7] hover:shadow-[0_10px_24px_rgba(91,58,41,0.30)]"
            }`}
          >
            {allLoaded ? "Collapse ♥" : "Load More ♥"}
          </button>
        </div>
      )}

      {/* Full Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${RITUALS[activeRitual].label} photo viewer`}
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
              alt={`Selected ${RITUALS[activeRitual].label.toLowerCase()} memory`}
              className="object-contain max-h-[88vh] max-w-full rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}