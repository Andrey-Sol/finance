export class CommonUtils {
    static getDateInRange(range) {
        const today = new Date();
        let result = null;

        switch (range) {
            case 'today':
                result = today;
                break;
            case 'week':
                result = new Date(today.setDate(today.getDate() - 7));
                break;
            case 'month':
                result = new Date(today.setMonth(today.getMonth() - 1));
                break;
            case 'year':
                result = new Date(today.setFullYear(today.getFullYear() - 1));
                break;
            case 'all':
                result = new Date(today.setFullYear(today.getFullYear() - 100));
                break;
            default:
                result = new Date();
        }

        const year = result.getFullYear();
        const month = String(result.getMonth() + 1).padStart(2, '0');
        const day = String(result.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
