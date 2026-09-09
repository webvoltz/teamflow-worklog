export interface UserData {
  viewer: {
    databaseId?: string;
    userId: string;
    name: string;
    username: string;
    email: string;
    userrole: string[];
    avatar: {
      height: number;
      url: string;
      width: number;
    };
    userInformation: {
      designation: string;
    };
  };
}
