/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

interface Duration {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    ms?: number;
    [unit: string]: number;
}

const between = (end: number, start?: number): Duration => {
    let time = start ? Math.abs(start - end) : end;
    time /= 1e3;

    // return milliseconds only if duration is less than a second
    if (time < 1) {
        return {
            ms: time * 1e3,
        };
    }

    const duration: Duration = {};

    const units: Duration = {
        years: 32436100,
        months: 2592000,
        days: 86400,
        hours: 3600,
        minutes: 60,
        seconds: 1,
    };

    for (const unit in units) {
        if (Object.prototype.hasOwnProperty.call(units, unit)) {
            const value = Math.floor(time / units[unit]);
            time -= value * units[unit];

            // only count non-zero units
            if (value) duration[unit] = value;
        }
    }

    return duration;
};

const humanize = (duration: Duration): string => {
    const string = [];
    for (const unit in duration) {
        if (Object.prototype.hasOwnProperty.call(duration, unit)) {
            string.push(duration[unit] + " " + unit);
        }
    }
    return string.join(" ");
};


export {
    between,
    humanize,
};
