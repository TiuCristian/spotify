<?php
$sourcePath = 'C:\\Users\\digital55\\.gemini\\antigravity\\brain\\ee9eb3ef-6f41-4a19-8c91-be365b6019c8\\media__1784020108677.png';
$targetPath = 'C:\\laragon\\www\\ReactSpotify\\public\\stainify-logo.png';
$img = imagecreatefrompng($sourcePath);
// Attempt to crop the transparent background automatically
$cropped = imagecropauto($img, IMG_CROP_TRANSPARENT);
if ($cropped !== false) {
    imagepng($cropped, $targetPath);
    imagedestroy($cropped);
    echo "Cropped successfully.\n";
} else {
    // If it fails, just save the original
    copy($sourcePath, $targetPath);
    echo "Crop failed, copied original.\n";
}
imagedestroy($img);
