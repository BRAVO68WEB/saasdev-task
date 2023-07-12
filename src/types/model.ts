/* eslint-disable @typescript-eslint/no-unused-vars */

interface IGroup {
    id: string;
    name: string;
    users: string[];
    emps?: string[];
    source: any;
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): IGroup;
}

interface ISource {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): ISource;
}

interface IApp {
    id: string;
    name: string;
    source: any;
    authorizedUsers: string[];
    authorizedGroups: string[];
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): IApp;
}

interface IUser {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    source: any;
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): IUser;
}
