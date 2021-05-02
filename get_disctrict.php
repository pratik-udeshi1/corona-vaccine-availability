<?php

$base_url = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/';
$content  = [];

for ($i = 1; $i <= 36; $i++) {
    $final_url            = $base_url . $i;
    $content['content'][$i]   = file_get_contents($final_url);
}

echo '<pre>';
print_r($content);
die;
