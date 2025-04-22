const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// รองรับนามสกุล .svg ให้ทำงานผ่าน react-native-svg
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts.push("svg");

// ถ้าจะใช้ svg แบบ import เป็น component (เช่น import Icon from './icon.svg')
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

module.exports = withNativeWind(config, { input: "./app/global.css" });
