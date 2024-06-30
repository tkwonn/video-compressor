export const timemarkToSeconds = (timemark: string): number => {
    const [hours, minutes, seconds] = timemark.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

export const getCRFValue = (quality: string): number => {
    switch (quality) {
        case 'Low': return 28;
        case 'Standard': return 18;
        case 'High': return 18;
        default: return 23;
    }
}

export const getPresetValue = (quality: string): string => {
    switch (quality) {
        case 'Low': return 'veryfast';
        case 'Standard': return 'medium';
        case 'High': return 'slow';
        default: return 'slow';
    }
}