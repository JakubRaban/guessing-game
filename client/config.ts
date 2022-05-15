import {isProduction} from "../src/helpers/env";

const devConfig = {
  SERVER_URL: 'http://localhost:9000'
};

const prodConfig = {
  SERVER_URL: window.location.protocol + '//' + window.location.host
}

const config = isProduction() ? prodConfig : devConfig;

export default config;
