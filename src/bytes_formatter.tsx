export default function bytes_formatter(bytes:number, decimals = 2, bits = false) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    let sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    if (bits) sizes = ['b/s', 'kb/s', 'mb/s', 'gb/s', 'tb/s', 'pb/s', 'eb/s', 'zb/s', 'yb/s'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
