export type locationType = {
  type: string;
  coordinates: [number, number];
};
export enum EventTypeEnum {
  MeteorShower = "Meteor Shower",
  ISSPass = "ISS Pass",
  LunarEclipse = "Lunar Eclipse",
}

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  location: locationType;
  bio: string;
  savedEvents: string[];
    _id: string;
}

export interface UserInterfaceProfile {
  name: string;
  email: string;
  password: string;
  location: locationType;
  bio: string;
  savedEvents: EventResponseInterface[];
    _id: string;
}


export interface userPostInterface {
  bio: string;
  email: string;
  name: string;
}

export interface PostInterface {
  imageUrl: string;
  caption: string;
  location: locationType;
  visibilityScore: number;
}

export interface PostResponseInterface extends PostInterface {
  eventId: any;
  likes: [String];
  dislikes: [String];
  likesCount: number;
  dislikesCount: number;
  _id: string;
  createdAt: Date;
  userId: userPostInterface;
}

export interface EventInterface {
  name: string;
  description: string;
  type: EventTypeEnum;
  visibilityScore: number;
  startTime: Date;
  endTime: Date;
  visibilityRegions: string[];
  moonPhase: number;
  source: string;
}

export interface EventResponseInterface extends EventInterface {
  postedUserId: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
  };
  interestedUserIds: string[];

  _id: string;
  createdAt: Date;
}

export interface AuthContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  message: string | null;
  setMessage: (msg: string | null) => void;
  fetchUser: (token: string) => Promise<void>;
}
