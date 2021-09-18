import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import Header from './Header'
import Main from './Main'
import Footer from "./Footer";

import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {api} from "../utils/Api";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
    const [currentUser, setCurrentUser] = useState({});

    function handleUpdateUser(profile) {
        api
            .updateUserInfo(profile)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((rej) => console.log(rej))
    }

    // Данные для профиля
    useEffect(() => {
        api
            .getUserInfo()
            .then((res) => {
                setCurrentUser(res);
            })
            .catch((rej) => console.log(rej))

    }, []);

    const [cards, setCards] = useState([])
    // Данные для рендера
    useEffect(() => {
        api
            .getInitialCards()
            .then((res) => {
                setCards(res)
            })
            .catch((rej) => console.log(rej));
    }, []);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    const [selectedCard, setSelectedCard] = useState({});

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard({});
    }

    function handlePopupClose(event) {
        if (event.target === event.currentTarget) {
            closeAllPopups();
        }
    }

    function handleAddPlaceSubmit(card) {
        api
            .addNewCard(card)
            .then((res) => {
                setCards([res, ...cards]);
                closeAllPopups();
            })
            .catch((rej) => console.log(rej))
    }

    function handleUpdateAvatar(profile) {
        api
            .updateAvatar(profile)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((rej) => console.log(rej))
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((rej) => console.log(rej));
    }

    function handleCardDelete(card) {
        api
            .deleteCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id))
            })
            .catch((rej) => console.log(rej));
    }

    useEffect(() => {
        const closeByEscape = (event) => {
            if (event.key === 'Escape') {
                closeAllPopups()
            }
        }
        document.addEventListener('keyup', closeByEscape)
        return () => document.removeEventListener('keyup', closeByEscape)
    }, [selectedCard, isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen])

    return (
            <CurrentUserContext.Provider value={currentUser}>
                <Header/>
                <Main cards={cards} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick} onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}/>
                <ImagePopup card={selectedCard} onClose={handlePopupClose}/>
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handlePopupClose}
                                  onUpdateUser={handleUpdateUser}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handlePopupClose}
                                 onUpdateAvatar={handleUpdateAvatar}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handlePopupClose}
                               onAddPlace={handleAddPlaceSubmit}/>
                <Footer/>
            </CurrentUserContext.Provider>
    )
}


export default App;