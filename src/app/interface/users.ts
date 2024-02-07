export interface User {
    createdBy: {
        name: string;
        id: string;
    };
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    dob: string;
    userId: string;
    status: string;
    empId: string;
    joinedDate: string;
    isAdmin: boolean;
    lastActive: string;
    isActive: boolean;
    designation: string;
    address: string;
    profileImageUrl: string | null;
    totalTickets: number;
    helpedTickets: number;
    resolvedTickets: number;
    pendingTickets: number;
    progressTickets: number;
    assignedTickets: number;
    groups: string[];
    breakTime: {
        startTime: string;
        startDate: string;
        endTime: string;
        endDate: string;
        type: string;
    }[];
    gender: string;
    newMessages: Record<string, number>;
    loginTimings: {
        inTime: string;
        date: string;
        outTime?: string;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}
