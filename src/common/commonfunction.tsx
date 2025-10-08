export const calculateContractTenure = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;

        let tenure = '';
        if (years > 0) tenure += `${years} year${years > 1 ? 's' : ''} `;
        if (months > 0) tenure += `${months} month${months > 1 ? 's' : ''} `;
        if (days > 0) tenure += `${days} day${days > 1 ? 's' : ''}`;

        return tenure.trim();
    }
    return '';      
};