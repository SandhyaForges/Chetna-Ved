import { useEffect, useMemo, useState } from "react";
import SectionHead from "./SectionHead";

const IMAGES_PER_PAGE = 24;

// 1. Fetching the remote storage base URL from Vercel's environment variables
const STORAGE_BASE_URL = import.meta.env.VITE_GALLERY_BASE_URL || "/";

const GALLERIES = {
  wedding: {
    label: "Wedding",
    directory: "wedding",
  },
};

// Keep small thumbnails local in your repository so they bundle quickly
const thumbnailImages = import.meta.glob(
  "../../image/wedding/thumbnails/*.webp",
  {
    query: "?url",
    import: "default",
  }
);

// ❌ REMOVED: import.meta.glob for full-size images is completely gone.
// Vite will no longer track or package the heavy originals.

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
      const filename = thumbKey.slice(prefix.length); // e.g., "1.webp"

      return {
        id: Number(filename.replace(".webp", "")),
        thumbKey,
        // ⚡ Dynamically maps to external storage using the Vercel Env Variable
        fullUrl: `${STORAGE_BASE_URL}${directory}/full/${filename}`,
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

  // Handle responsive masonry layout columns based on screen width
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

  // Reset gallery state when switching tabs
  useEffect(() => {
    setVisibleCount(IMAGES_PER_PAGE);
    setLoadedImages({});
    setImageSizes({});
  }, [activeGallery]);

  // Handle lazy-loading and dimensions gathering for thumbnails
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
                resolve({ image, url, width: 0, height: 0 });
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

      results.filter(Boolean).forEach(({ image, url, width, height }) => {
        nextImages[image.thumbKey] = url;
        if (width && height) {
          nextSizes[image.thumbKey] = { width, height };
        }
      });

      if (Object.keys(nextImages).length) {
        setLoadedImages((current) => ({ ...current, ...nextImages }));
      }
      if (Object.keys(nextSizes).length) {
        setImageSizes((current) => ({ ...current, ...nextSizes }));
      }
    };

    loadVisibleImages();
    return () => { cancelled = true; };
  }, [visibleCount, activeGallery, visibleImages, loadedImages]);

  // Distribute items into columns evenly based on height ratios
  const columns = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    const containerWidth = 1400;
    const gap = 4;
    const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

    visibleImages.forEach((image) => {
      const size = imageSizes[image.thumbKey];
      let estimatedHeight = columnWidth;

      if (size?.width && size?.height) {
        estimatedHeight = columnWidth * (size.height / size.width);
      }

      let shortestColumn = 0;
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < columnHeights[shortestColumn]) {
          shortestColumn = i;
        }
      }

      result[shortestColumn].push(image);
      columnHeights[shortestColumn] += estimatedHeight + gap;
    });

    return result;
  }, [visibleImages, imageSizes, columnCount]);

  const handleLoadMore = () => {
    setVisibleCount((current) =>
      Math.min(current + IMAGES_PER_PAGE, allImages.length)
    );
  };

  const handleCollapse = () => {
    setVisibleCount(IMAGES_PER_PAGE);
    document.getElementById("gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Loads the cloud storage photo string natively on click
  const openImage = (image) => {
    setSelectedImage(image.fullUrl);
  };

  // Lock scroll background and manage escape keys when Lightbox is active
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
    <section id="gallery" className="px-4 sm:px-6 lg:px-[6vw] py-16 scroll-mt-24">
      <SectionHead kicker="Moments That Last Forever" title="Our Best Moments" />

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
          <span className="relative z-10">💍 Wedding</span>
        </button>
      </div>

      {/* Masonry Gallery Grid */}
      <div className="max-w-[1400px] mx-auto flex gap-1 items-start">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 min-w-0 flex flex-col gap-1">
            {column.map((image) => {
              const src = loadedImages[image.thumbKey];
              return (
                <button
                  type="button"
                  key={image.id}
                  aria-label={`Open wedding memory ${image.id}`}
                  className="relative block w-full overflow-hidden rounded-md bg-gray-100 text-left aspect-auto"
                  onClick={() => openImage(image)}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`Wedding memory ${image.id}`}
                      className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full bg-gray-200 animate-pulse aspect-square" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-12 gap-4">
        {!allLoaded && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-6 py-3 bg-[#5B3A29] text-white rounded-full font-medium hover:bg-[#4A2F22] transition-colors duration-300"
          >
            Load More
          </button>
        )}
        {visibleCount > IMAGES_PER_PAGE && (
          <button
            type="button"
            onClick={handleCollapse}
            className="px-6 py-3 border border-[#5B3A29] text-[#5B3A29] rounded-full font-medium hover:bg-[#FBF4E7] transition-colors duration-300"
          >
            Collapse
          </button>
        )}
      </div>

      {/* Full Screen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white text-3xl font-light hover:text-gray-300 focus:outline-none"
            onClick={() => setSelectedImage(null)}
            aria-label="Close modal"
          >
            &times;
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Expanded wedding memory"
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
