# Gen Draw
Developed in one day in Vanilla JS, Gen Draw enables the creation of img2img (inpainting) images using the StableHorde API.

StableHorde is a crowdsourced distributed server, allowing people to create images with Stable Diffusion, a powerful deep learning model.

For a one-day project, I'm very happy with the results and it has been great fun to develop. I hope you'll enjoy drawing, entering a prompt and seeing what the AI creates!

## Try it live
👉 [https://francesconatali.com/personalprojects/gendraw/](https://francesconatali.com/personalprojects/gendraw/) 

## Screenshots
<img width="400" alt="gendraw_duck_drawing" src="https://github.com/francesconatali/gendraw/assets/34441930/51004d36-feaf-4273-8427-5581494be72e">
<img width="400" alt="gendraw_duck_image" src="https://github.com/francesconatali/gendraw/assets/34441930/b195bc2d-c785-4ef8-8ec0-ee32c45919de">
<img width="400" alt="gendraw_galaxy_drawing" src="https://github.com/francesconatali/gendraw/assets/34441930/22768d5c-43e4-456f-8a58-8acfc075ccdb">
<img width="400" alt="gendraw_galaxy_image" src="https://github.com/francesconatali/gendraw/assets/34441930/47facd95-3de6-4564-84ce-b6c37034a2f2">
  
_And this is how it looked like in the morning, still a lot to do!_<br>
<img width="400" alt="screenshot-v01" src="https://github.com/francesconatali/gendraw/assets/34441930/fbb05f29-eb94-454b-9cef-10b8d6bf4e29">

## StableHorde API
Alongside coding and UI, I also had to spend some time getting to know the [StableHorde API](https://stablehorde.net/api/), as well as the meaning of the many parameters required when submitting an initial request. Inside [stablehordeAPI.js](https://github.com/francesconatali/gendraw/blob/main/js/stablehordeAPI.js) I annotated each parameter with comments, giving you a head-start if you wish to fine-tune the results to your liking.

Whilst StableHorde is a great free public service, it does come with its limitations: 

- I noticed that during the daytime in the USA, the service is often very busy, and it might take several minutes before your image is finally rendered.
- Each request to generate an image has a 'weight', the more demanding your request is, the higher its 'weight' will be. Especially when using the anonymous/public API key ("0000000000"), the image generation is capped to a certain 'weight', which means more demanding requests are ignored/dropped. The current settings in Gen Draw are being finely tuned to get the most out of this 'weight' allowance from StableHorde.

## Type of Processing

While generating an image starting from another image is often simply called 'img2img', in reality this comes in 3 different flavours:

- Img2Img: Transforms an input image into a different style or appearance while maintaining its original structure.
- Inpainting: Fills in missing or removed parts of an image based on the surrounding context.
- Outpainting: Expands the edges of an image to create a larger canvas, continuing the original image's style and content.

In the context of Gen Draw, due to the minimalistic and 'sketchy' nature of an image drawn on HTML canvas, I opted for "Inpainting". You can see this on line 24 in stablehordeAPI.js:  `source_processing: "inpainting"`.

I hope you'll enjoy using Gen Draw, and if you fork it and improve it, let me know! 🙋
