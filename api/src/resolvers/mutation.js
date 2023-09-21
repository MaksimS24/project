const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');


module.exports = {
    newNote: async (parent, args, { models, user }) => {
        //Если в контексте нет пользователя, выбрасываем AuthenticationError
        if (!user) {
            throw new AuthenticationError('You must be signed in to create note');
        }
        return models.Note.create({
            content: args.content,
            //Ссылаемся на mongo id автора
            author: new mongoose.Types.ObjectId(user.id),
        });
    },

    deleteNote: async (parent, { id }, { models, user }) => {
        //Если не пользователь, выбрасывать ошибку авторизации
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }

        //Находим заметку
        const note = await models.Note.findById({_id: id});
        //Если владелец заметки и текущей пользователь не совпадают, выбрасываем
        //запрет на действие

        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note");
        }

        try {
            //Если все проверки проходят, удаляем заметки
            await note.deleteOne({_id: id});
            return true;
        } catch (err) {
            console.log(err);
            //Если в процесс возникает ошибка, возвращаем false
            return false;
        }
    },


    updateNote: async (parent, { content, id }, { models, user }) => {
        //Если не пользователь, выбрасываем ошибку авторизации
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }

        //Находим заметку
        const note = await models.Note.findById({ _id: id });
        //Если владелец заметки и текущей пользователь не совпадают, выбрасываем
        //запрет на действие
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permission to update the note");
        }

        //Обновляем заметку в БД и возвращаем ее в обновленном виде
        return models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },

    signUp: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt.hash(password, 10);
        // create the gravatar url
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });

            // create and return the json web token
            return await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            // if there's a problem creating the account, throw an error
            throw new Error('Error creating account');
        }
    },

    signIn: async (parent, { username, email, password }, { models }) => {
        if (email) {
            //Нормализуем e-mail
            email = email.trim().toLowerCase();
        }

        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        });

        //Если пользователь не найден, выбрасываем ошибку аутентификации
        if(!user) {
            throw new AuthenticationError('Error signing in');
        }

        //Если пароли не совпадают, выбрасываем ошибку аутентификации
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        //Создаем и возвращаем json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },

    toggleFavorite: async (parent, { id }, { models, user }) => {
        //Если контекст пользователя не передан, выбрасываем ошибку
        if (!user) {
            throw new AuthenticationError();
        }

        //Проверяем, отмечал ли пользователь заметку как избранную
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);

        //Если пользователь есть в списке, удаляем его оттуда и уменьшаем значение
        //favoriteCount на 1
        if (hasUser >= 0) {
            return models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: new mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    //Установим new как true, чтобы вернуть обновленный документ
                    new: true
                }
            );
        } else {
            //Если пользователя в списке нет, добовляем его туда и увеличиваем
            //значение favoriteCount на 1
            return models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: new mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            );
        }
    },

};