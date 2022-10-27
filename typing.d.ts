declare type Post = {
  _id: string;
  title: string;
  description: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    role: string[];
  };
  createdAt: string;
  updatedAt: string;
};

declare type User = {
  name: string;
  email: string;
  _id: string;
  role: string[];
  createdAt: string;
  updatedAt: string;
};
