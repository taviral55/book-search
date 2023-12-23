const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const { ApolloServer, gql } = require("apollo-server");
const { User } = require("./models");
const { signToken } = require("./utils/auth");
// const {typeDefs} = require("./schema.js")
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const secret = "mysecretsshhhhh";
const expiration = "2h";

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

const typeDefs = gql`
  type Books {
    authors: [String]
    description: String
    bookId: String
    image: String
    title: String
    _id: ID
  }
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Books]
  }
  type LoginResponse {
    user: User
    token: String
  }
  type Query {
    name: String
  }
  type Mutation {
    loginUser(email: String, password: String): LoginResponse
  }
  type Mutation {
    createAccount(email: String, password: String, username: String): LoginResponse
  }
  input Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    title: String
    _id: ID
  }
  type Mutation {
    getPersonalInfo(token: String): User
  }
  type Mutation {
    saveBook(book: Book, token: String!): User
  }
  type Mutation {
    deleteBook(bookId: String, token: String!): User
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {},
  Mutation: {
    async loginUser(_, args) {
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new Error("Invalid credentials");
      }
      const token = signToken(user);

      return { user, token };
    },
    //Account registration
    async createAccount(_, args) {
      const user = await User.create(args);
      if (!user) {
        throw new Error(" Something is wrong!");
      }
      const token = signToken(user);
      return { token, user };
    },

    //Save book
    async saveBook(_, args) {
      try {
        const { data } = jwt.verify(args.token, secret, { maxAge: expiration });
        const updatedUser = await User.findOneAndUpdate(
          { _id: data._id },
          { $addToSet: { savedBooks: args.book } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error("Something went wrong, please try again later");
      }
    },
    async deleteBook(_, args) {
      try {
        const { data } = jwt.verify(args.token, secret, { maxAge: expiration });
        const updatedUser = await User.findOneAndUpdate(
          { _id: data._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error("Something went wrong, please try again later");
      }
    },

    // Get own account information
    async getPersonalInfo(_, args) {
      try {
        const { data } = jwt.verify(args.token, secret, { maxAge: expiration });
        const foundUser = await User.findOne({
          $or: [{ _id: data._id }, { username: data.username }],
        });
        return foundUser;
      } catch (error) { }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

db.once("open", () => {
  server.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
