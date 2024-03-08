const GreatCircle = {

    validateRadius(unit:string) {
        const r: Record<string, number> = { M: 6371009, KM: 6371.009, MI: 3958.761, NM: 3440.070, YD: 6967420, FT: 20902260 };
        if (unit in r) return r[unit];
        return r.KM;
    },

    distance(lat1:number, lon1:number, lat2:number, lon2:number, unit:string) {
        let r;
        if (unit === undefined) {
            r = this.validateRadius('KM');
        } else {
            r = this.validateRadius(unit);
        }
        const latitude1 = (lat1 * Math.PI) / 180;
        const longitude1 = (lon1 * Math.PI) / 180;
        const latitude2 = (lat2 * Math.PI) / 180;
        const longitude2 = (lon2 * Math.PI) / 180;
        const lonDelta = longitude2 - longitude1;
        const a = (Math.cos(latitude2) * Math.sin(lonDelta)) ** 2 + (Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(lonDelta)) ** 2;
        const b = Math.sin(latitude1) * Math.sin(latitude2) + Math.cos(latitude1) * Math.cos(latitude2) * Math.cos(lonDelta);
        const angle = Math.atan2(Math.sqrt(a), b);

        return angle * r;
    },

    bearing(lat1:number, lon1:number, lat2:number, lon2:number) {
        const latitude1 = (lat1 * Math.PI) / 180;
        const longitude1 = (lon1 * Math.PI) / 180;
        const latitude2 = (lat2 * Math.PI) / 180;
        const longitude2 = (lon2 * Math.PI) / 180;
        const lonDelta = longitude2 - longitude1;
        const y = Math.sin(lonDelta) * Math.cos(latitude2);
        const x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(lonDelta);
        let brng = Math.atan2(y, x);
        brng *= (180 / Math.PI);

        if (brng < 0) { brng += 360; }

        return brng;
    },

    destination(lat1:number, lon1:number, brng:number, dt:number, unit:string) {
        let r;
        if (unit === undefined) r = this.validateRadius('KM');
        else r = this.validateRadius(unit);

        const latitude1 = (lat1 * Math.PI) / 180;
        const longitude1 = (lon1 * Math.PI) / 180;
        const lat3 = Math.asin(Math.sin(latitude1) * Math.cos(dt / r) + Math.cos(latitude1) * Math.sin(dt / r) * Math.cos((brng * Math.PI) / 180));
        const lon3 = longitude1 + Math.atan2(Math.sin((brng * Math.PI) / 180) * Math.sin(dt / r) * Math.cos(latitude1), Math.cos(dt / r) - Math.sin(latitude1) * Math.sin(lat3));

        return {
            LAT: (lat3 * 180) / Math.PI,
            LON: (lon3 * 180) / Math.PI,
        };
    },

};
export default GreatCircle;
