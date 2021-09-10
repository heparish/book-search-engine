const { User } = require('../models')
const signToken = require('../utils/auth.js')
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        user: async (parent, {args}) => {
            const userFind = await User.findOne({args}).populate('savedBooks')
            return userFind
        },

        users: async () => {
            return User.find({})
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id:context.user._id}).populate('savedBooks')
            }
            throw new AuthenticationError('You are not logged in.')
        },
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const userLogin = await User.findOne({email})
            if (!user) {
                throw new AuthenticationError('Could not find user.')
            }
            const checkPw = await user.isCorrectPassword(password)
            if (!checkPW) {
                throw new AuthenticationError('Password is incorrect.')
            }
            const token = signToken(user)
            return {token, user}
        }, 
        addUser: async (parent, {userName, email, password}) => {
            const user = await User.create({userName, email, password})
            const token = signToken(user)
            return {token, user}
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const usersBooks = await User.findOneAndUpdate({_id: context.user._id}, {$addToSet: {savedBooks:args}},)
                
            }return usersBooks
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const deleteBooks = await User.findOneAndUpdate({_id: context.user.id}, {$pull: {savedBooks:{bookId}}})
               
            } return deleteBooks
        }
    },
}