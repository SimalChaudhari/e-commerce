import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';

// Dummy image URL for fallback
const DUMMY_IMAGE = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

// ----------------------------------------------------------------------

export function BannerDetailsCarousel({ image }) {

  const singleImage = image || DUMMY_IMAGE; // Use provided image or fallback to dummy image
  const carousel = useCarousel();

  const lightbox = useLightBox([{ src: singleImage }]); // Single image for lightbox

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(0, true); // No index needed as there’s only one image
    }
  }, [carousel.mainApi, lightbox.open]);

  return (
    <>
      <div>
        <Box sx={{ mb: 2.5, position: 'relative' }}>


          <Carousel carousel={carousel} sx={{ borderRadius: 2, maxWidth: '50%', mx: 'auto' }}>
            <Image
              alt="Product Image"
              src={singleImage}
              ratio="1/1"
              onClick={() => lightbox.onOpen(singleImage)}
              sx={{ cursor: 'zoom-in', width: 'auto', height: 'auto' }}
            />
          </Carousel>
        </Box>
      </div>

      <Lightbox
        index={lightbox.selected}
        slides={[{ src: singleImage }]}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={() => lightbox.setSelected(0)}
      />
    </>
  );
}
