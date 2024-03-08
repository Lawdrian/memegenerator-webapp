import React, { useEffect } from 'react';

export default function ImageToText() {

    useEffect(() => {
        const imageUrl = 'https://www.americanexpress.com/de-de/amexcited/media/webp/de-de/amexcited/media/cache/article_intro_hero_tablet/cms/2022/01/Schwarz-Weiss-Fotografie-Titelbild-scaled.webp?672284';

        const fetchData = async () => {
            try {
                const responseImage = await fetch(imageUrl);
                const blobImage = await responseImage.blob();

                const formData = new FormData();
                formData.append('image', blobImage, 'image.jpg');

                const response = await fetch('https://api.api-ninjas.com/v1/imagetotext', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",        
                        "Access-Control-Allow-Origin": "*",  // CORS: Cross-Origin Resource Sharing
                        'Content-Type': 'multipart/form-data',
                        
                    },
                });

                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
                }

                const result = await response.json();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>ImageToText</h1>
        </div>
    );
}
