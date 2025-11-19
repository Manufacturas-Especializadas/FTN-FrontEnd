export const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return "-";

    try {
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
            return "-";
        }

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error formeateando fecha: ", error);
        return "-";
    }
};

export const dateFormats = {
    short: (dateTimeString: string) => {
        if (!dateTimeString) return "-";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString("es-Mx", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return "-";
        }
    },
    long: (dateTimeString: string): string => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    },

    timeOnly: (dateTimeString: string): string => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    },

    dateOnly: (dateTimeString: string): string => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    }
}