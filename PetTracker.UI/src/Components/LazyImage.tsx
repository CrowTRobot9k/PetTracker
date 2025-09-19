import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    onLoad?: () => void;
    onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
    src, 
    alt, 
    placeholder = "/placeholder.png", 
    className, 
    style,
    onLoad,
    onError 
}) => {
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
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    return (
        <div ref={imgRef} className={className} style={style}>
            {!isInView ? (
                <img 
                    src={placeholder} 
                    alt="Loading..." 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: 'blur(5px)',
                        transition: 'filter 0.3s ease'
                    }} 
                />
            ) : (
                <>
                    {!isLoaded && !hasError && (
                        <img 
                            src={placeholder} 
                            alt="Loading..." 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                filter: 'blur(5px)',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }} 
                        />
                    )}
                    <img
                        src={hasError ? placeholder : src}
                        alt={alt}
                        onLoad={handleLoad}
                        onError={handleError}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default LazyImage;

