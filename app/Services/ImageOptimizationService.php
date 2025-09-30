<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageOptimizationService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Optimize and store an uploaded image
     */
    public function optimizeAndStore(UploadedFile $file, string $directory = 'images', array $sizes = []): array
    {
        $filename = $this->generateFilename($file);
        $paths = [];

        // Default sizes if none provided
        if (empty($sizes)) {
            $sizes = [
                'original' => null,
                'large' => ['width' => 1200, 'height' => 800],
                'medium' => ['width' => 600, 'height' => 400],
                'thumbnail' => ['width' => 300, 'height' => 200],
            ];
        }

        foreach ($sizes as $sizeName => $dimensions) {
            $image = $this->imageManager->read($file->getPathname());
            
            if ($dimensions) {
                $image = $image->resize($dimensions['width'], $dimensions['height'], function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Optimize quality
            $quality = $this->getOptimalQuality($file->getSize());
            
            $sizeFilename = $sizeName === 'original' ? $filename : $this->addSizeToFilename($filename, $sizeName);
            $path = "{$directory}/{$sizeFilename}";
            
            // Convert to WebP for better compression
            $webpPath = $this->changeExtension($path, 'webp');
            
            // Store both formats
            Storage::disk('public')->put($path, $image->toJpeg($quality));
            Storage::disk('public')->put($webpPath, $image->toWebp($quality));
            
            $paths[$sizeName] = [
                'jpeg' => $path,
                'webp' => $webpPath,
                'url' => Storage::disk('public')->url($path),
                'webp_url' => Storage::disk('public')->url($webpPath),
            ];
        }

        return $paths;
    }

    /**
     * Generate a unique filename
     */
    private function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $hash = substr(md5($name . time()), 0, 8);
        
        return "{$name}_{$hash}.{$extension}";
    }

    /**
     * Add size suffix to filename
     */
    private function addSizeToFilename(string $filename, string $size): string
    {
        $pathInfo = pathinfo($filename);
        return $pathInfo['filename'] . "_{$size}." . $pathInfo['extension'];
    }

    /**
     * Change file extension
     */
    private function changeExtension(string $path, string $newExtension): string
    {
        $pathInfo = pathinfo($path);
        return $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '.' . $newExtension;
    }

    /**
     * Get optimal quality based on file size
     */
    private function getOptimalQuality(int $fileSize): int
    {
        // Larger files get more compression
        if ($fileSize > 2000000) { // > 2MB
            return 70;
        } elseif ($fileSize > 1000000) { // > 1MB
            return 80;
        } else {
            return 85;
        }
    }

    /**
     * Delete all variants of an image
     */
    public function deleteImage(string $path): void
    {
        $pathInfo = pathinfo($path);
        $directory = $pathInfo['dirname'];
        $filename = $pathInfo['filename'];
        
        // Delete all size variants
        $files = Storage::disk('public')->files($directory);
        
        foreach ($files as $file) {
            if (str_contains($file, $filename)) {
                Storage::disk('public')->delete($file);
            }
        }
    }
}