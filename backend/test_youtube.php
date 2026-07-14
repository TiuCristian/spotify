<?php
$term = urlencode("2pac black panther grab my strab");
$url = "https://www.youtube.com/results?search_query=" . $term;
$html = file_get_contents($url);
preg_match('/"videoId":"(.*?)"/', $html, $matches);
if (isset($matches[1])) {
    $videoId = $matches[1];
    $thumbnail = "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg";
    echo "Found thumbnail: $thumbnail\n";
} else {
    echo "Not found\n";
}
