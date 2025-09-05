import sharp from "sharp";
const inputFile="./public/icons/5043922.png";
const outputDir="./public/icons";
async function generate192() {
    try{
        await sharp(inputFile).resize(192,192)
        .toFile(`${outputDir}/icon-192192.png`);
        console.log("192  icon generated");
    }catch(err){
        console.error("Error generating     :",err);
    }
}

generate192();