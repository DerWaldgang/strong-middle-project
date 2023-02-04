import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import { BuildOptions } from "./types/config.interface";

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
  // Порядок в лоадерах имеет значение
  // Если не используем typescript - то нужен был бы еще babel-loader под jsx

  const cssSassLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      // этот плагин нужен чтобы в папке build была отдельная css папка для стилей, иначе стили буду попадать в js файл bundl'a
      options.isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      // Translates CSS into CommonJS
      {
        loader: "css-loader",
        // name.module.scss чтобы поддерживал
        options: {
          modules: {
            // чтобы module работали только файлы где есть .module. , иначе стили так как index.scss не будут работать
            auto: (resPath: string) => Boolean(resPath.includes(".module.")),
            // чтобы в dev сборке можно было понять какой стил за что ответчает, иначе там в стилях hash будет что не удобно при разработке
            localIdentName: options.isDev
              ? "[path][name]__[local]--[hash:base64:5]"
              : "[hash:base64:8]",
          },
        },
      },
      // Compiles Sass to CSS
      "sass-loader",
    ],
  };
  const typescriptLoader = {
    test: /\.tsx?$/,
    use: "ts-loader",
    exclude: /node_modules/,
  };

  return [typescriptLoader, cssSassLoader];
}
