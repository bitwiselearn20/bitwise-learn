import InfoBlock from "./InfoBlock";

type InstitutionSidebarProps = {
    institution: any;
};

const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const getOrdinalSuffix = (n: number): string => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const InstitutionSidebar = ({ institution }: InstitutionSidebarProps) => {
    const formattedDate = institution.createdAt ? formatDate(institution.createdAt) : '';

    return (
        <aside className="w-[320px] bg-[#1b1b1b] text-white p-6 rounded-xl min-h-[93vh]">
        <h1 className="text-2xl font-semibold mb-1">{institution.name}</h1>
        <p className="text-sm text-gray-400 mb-6">{institution.tagline}</p>
        
        
        <div className="space-y-4 text-sm">
        <InfoBlock label="Address" value={institution.address} />
        <InfoBlock label="Website Link" value={institution.websiteLink} />
        <InfoBlock label="Email" value={institution.email} />
        <InfoBlock label="Contact number" value={institution.phoneNumber} />
        <InfoBlock label="Member Since" value={formattedDate} />
        </div>
        </aside>
        );
};

export default InstitutionSidebar;
