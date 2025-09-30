import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    webpSrc?: string;
    alt: string;
    placeholder?: string;
    className?: string;
    sizes?: string;
    srcSet?: string;
}

export default function LazyImage({ 
    src, 
    webpSrc,
    alt, 
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    className = '',
    sizes,
    srcSet,
    ...props 
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    // Check if browser supports WebP
    const supportsWebP = () => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch {
            return false;
        }
    };

    const getOptimalSrc = () => {
        if (hasError) return placeholder;
        if (!isInView) return placeholder;
        
        // Use WebP if supported and available
        if (webpSrc && supportsWebP()) {
            return webpSrc;
        }
        
        return src;
    };

    return (
        <div className="relative overflow-hidden">
            {webpSrc && isInView ? (
                <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                        ref={imgRef}
                        src={getOptimalSrc()}
                        alt={alt}
                        onLoad={handleLoad}
                        onError={handleError}
                        className={`lazy-image transition-opacity duration-300 ${
                            isLoaded ? 'loaded opacity-100' : 'opacity-0'
                        } ${className}`}
                        loading="lazy"
                        sizes={sizes}
                        srcSet={srcSet}
                        decoding="async"
                        {...props}
                    />
                </picture>
            ) : (
                <img
                    ref={imgRef}
                    src={getOptimalSrc()}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`lazy-image transition-opacity duration-300 ${
                        isLoaded ? 'loaded opacity-100' : 'opacity-0'
                    } ${className}`}
                    loading="lazy"
                    sizes={sizes}
                    srcSet={srcSet}
                    decoding="async"
                    {...props}
                />
            )}
            {!isLoaded && isInView && !hasError && (
                <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}