import { BASE_IMAGE_URL } from '@/common/config'

class Image {
  /**
   * Constructor
   */
  constructor() {
    this.baseUrl = process.env.VUE_APP_FILE_URL || BASE_IMAGE_URL;
    // console.log(`BASE URL IMAGE: ${this.baseUrl}`);
    // this.baseUrl = 'https://minio.vnstore.xyz/';
  }

  /**
   * Get image url
   */
  url(pathOrigin, resize) {
    let path = pathOrigin;
    if (!path) return;
    // console.log(pathOrigin);
    // console.log('path', path);
    if (path.includes('https://minio.vnstore.xyz/hiweb-development')) {
      path = path.replace('https://minio.vnstore.xyz/hiweb-development/', '/');
    }
    if (resize && !path.includes('/resize/') && !path.includes(`${this.baseUrl}`)) {
      path = `img/${resize.width}/${resize.height}/resize${path}`;
    }
    if (!resize && !path.includes('/resize/') && !path.includes(`${this.baseUrl}`)) {
      path = `img/${50}/${50}/resize${path}`;
    }
    if (path.includes(`${this.baseUrl}`)) {
      //image oldold
      // path = path.replace('https://minio.vnstore.xyz/', 'https://minio.lattehub.com/');
      return path && (path.includes('https://') || path.includes('data:image') || path.includes('http://'))
        ? path
        : this.baseUrl + path;
    } else {
      return path && (path.includes('https://') || path.includes('data:image') || path.includes('http://'))
        ? pathOrigin
        : this.baseUrl + path;
    }
  }

  /**
   * Resize image
   */
  resize(path) {
    return this.url(path);
  }
}

export default new Image();
