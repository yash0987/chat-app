export function fileSize(dataSize) {
    let count = 0;
    let bytes = Number(dataSize);
    while (bytes > 1024) {
      bytes /= 1024;
      count++;
    }

    const unitOfDigits = ['B', 'kB', 'MB', 'GB'];
    return `${bytes.toFixed(1)} ${unitOfDigits[count]}`;
}