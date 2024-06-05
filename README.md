
# Harvest.AI

Welcome to our AI-based platform designed to drive innovation in agriculture. Our mission is to address the unique agricultural challenges faced by regions with extreme temperatures, water scarcity, and sandy soil. By leveraging cutting-edge AI technologies, we aim to enhance crop productivity, optimize resource usage, and ensure sustainable farming practices.



## Tech stack
- Typescript, Next.js, Recoil, Leaflet (Used for Map Component)
- Rapid API, OnDemand Plugins, LightGBM (Used for training the model for Crop suggestion plugin)

## Video Demo
[![Demo Video](https://cdn.loom.com/sessions/thumbnails/8cacc08516364edca28194267cb3f57e-with-play.gif)](https://www.loom.com/share/8cacc08516364edca28194267cb3f57e?sid=a8de2eff-de2d-49a0-b7dd-3a9e8afefad1 "Demo Video")

## Setup Locally

#### Clone the project

```bash
  git clone https://github.com/aditya-kumar-25/Harvest.AI
```

#### Go to the project directory

```bash
  cd Harvest.AI
```

#### Install dependencies

```bash
  npm install
```

#### Start the Next.js app

```bash
  npm run dev
```


## Features

- [x] Global World Map with seamless UI connected to all the plugins such that the data changes based upon on the location selected in map
- [x] Weather Information of the location selected
- [x] Soil Quality Information of the location selected
- [x] Water Level and their Quality of the location selected
- [x] Crop Suggestion based upon the factors like Water Quality, Soil Quality, Weather/Climatic Conditions & Heat Stress Levels With a custom ML model trained Plugin built with LightGBM and OnDemand Platform.
- [x] Chat Bot for answering other information needed by the having efficient agricultural practices and information.

## Maintainers

<a href="https://github.com/164adityakumar/Harvest.AI/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=164adityakumar/Harvest.AI" />
</a>


## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!



## License

[MIT](https://choosealicense.com/licenses/mit/)

