/**
 * ============================================================
 * Optimized Image Component for Core Web Vitals
 * ============================================================
 * Implements:
 * - Automatic lazy loading for below-fold images
 * - Next.js Image optimization with srcset
 * - CLS prevention with width/height attributes
 * - Priority loading for above-fold images
 * - WebP/AVIF format support
 * - Responsive image sizes
 * ============================================================
 */

import Image from 'next/image';

/**
 * Optimized Image Component
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text (required for SEO)
 * @param {number} props.width - Image width (required for CLS prevention)
 * @param {number} props.height - Image height (required for CLS prevention)
 * @param {boolean} props.priority - Set true for above-fold images (disables lazy loading)
 * @param {boolean} props.fill - Use fill layout instead of fixed dimensions
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {string} props.className - CSS classes
 * @param {string} props.loading - 'lazy' | 'eager' (default: 'lazy')
 * @param {string} props.quality - Image quality 1-100 (default: 75)
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  fill = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  loading = 'lazy',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  style,
  ...props
}) {
  // Default blur placeholder for CLS prevention
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k=';

  // Determine if this is an external image
  const isExternal = src?.startsWith('http') || src?.startsWith('//');
  
  // For external images, use regular img tag with lazy loading
  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        style={{
          width: width ? '100%' : 'auto',
          height: height ? 'auto' : 'auto',
          maxWidth: width ? `${width}px` : '100%',
          ...style,
        }}
        {...props}
      />
    );
  }

  // For local images, use Next.js Image component
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={className}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        style={style}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : loading}
      quality={quality}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      style={style}
      {...props}
    />
  );
}

/**
 * Tournament Card Image - Pre-optimized for tournament listings
 */
export function TournamentImage({ src, alt, priority = false }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={320}
      height={180}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
      className="rounded-lg object-cover"
    />
  );
}

/**
 * Blog Hero Image - Optimized for blog post headers
 */
export function BlogHeroImage({ src, alt, priority = true }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority={priority}
      sizes="100vw"
      className="w-full h-auto rounded-xl"
    />
  );
}

/**
 * Avatar Image - Small profile pictures
 */
export function AvatarImage({ src, alt, size = 48 }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={false}
      sizes={`${size}px`}
      className="rounded-full"
    />
  );
}

/**
 * Thumbnail Image - Small preview images
 */
export function ThumbnailImage({ src, alt }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      priority={false}
      sizes="(max-width: 640px) 100px, 150px"
      className="rounded-md"
    />
  );
}
