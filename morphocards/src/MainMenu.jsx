import {
  AcademicCapIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import TextAnimation from "react-animate-text";

import Firebase from "./Firebase";
import Button from "./components/Button";
import MusicSound from "./components/MusicSound";
import ResultPage from "./ResultPage";
import AppLogo from "./components/AppLogo";
import LeaderboardPreview from "./components/LeaderboardPreview";
import Modal from "./components/Modal";
import Leaderboard from "./components/Leaderboard";

export default function MainMenu(props) {
  const play = () => {
    props.setWindow("game");
  };

  const [showList, setShowList] = useState(false);

  const goToList = () => {
    setShowList(true);
  };

  const backToMenu = () => {
    setShowList(false);
  };

  useEffect(() => {
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        // LOGGED
        props.setLogged(true);
      } else {
        // PAS LOGGED :
        props.setLogged(false);
      }
    });
  }, [props]);

  return (
    <div
      className="w-full h-full overscroll-none overflow-hidden flex items-center
    bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate"
    >
      <div className="w-full h-full bg-white bg-opacity-25 background-filter backdrop-blur-lg	flex items-center justify-center px-2">
        {showList ? (
          <ResultPage backToMenu={backToMenu} />
        ) : (
          <MenuContent
            play={play}
            isLogged={props.isLogged}
            goToList={goToList}
          />
        )}

        {props.sound !== null ? (
          <MusicSound
            sound={props.sound}
            additionnalStyle="absolute right-10 top-8"
          />
        ) : (
          ""
        )}
        {showList ? (
          <AppLogo
            onClick={backToMenu}
            additionnalStyle="absolute top-8 left-10"
          />
        ) : (
          ""
        )}

        {showList ? "" : <LeaderboardPreview />}

        <a
          target="_blank"
          href="https://github.com/Les-Scrums-Masters/Morphocards"
          className="absolute bottom-5 right-8 text-white text-opacity-50 hover:text-opacity-100"
          rel="noopener noreferrer"
        >
          Les Scrums Masters © 2021
        </a>
      </div>
    </div>
  );
}

function MenuContent(props) {
  // ------- Boite de dialogue  -------
  const [modalEmoji, setModalEmoji] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [modalContent, setModalContent] = useState(null);
  const [Buttons, setButtons] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState(null);

  let showInfoModal = () => {
    setModalEmoji(String.fromCodePoint(0x2139));
    setModalTitle("Objectif pédagogique");
    setModalContent(
      <p>
        En jouant à notre jeu sérieux vous travaillerez sur un sous-ensemble de
        la dyslexie, la <b>dyslexie phonologique</b> (la forme la plus
        courante).
        <br />
        <br />
        Notre thèse étudiée évoque le trouble d'acquisition de la lecture et de
        l’écoute, causé par un déficit d'identification des mots écrits.
        <br />
        La dyslexie phonologique concerne la formation et la construction des
        mots à partir de <b>phonèmes</b> (élément sonore du langage parlé,
        considéré comme une unité distinctive).
        <br />
        <br />
        Le but du jeu est d'<b>aider à la compréhension</b> en s’appuyant sur
        l'entraînement à la morphologie, une branche de la linguistique.
      </p>
    );

    setButtons(
      <Button
        onClick={() => setModalOpen(false)}
        color="ring-green-200 text-white hover:bg-green-700 active:bg-green-900 bg-green-600"
      >
        J'ai compris !
      </Button>
    );
    setModalWidth("sm:max-w-3xl");
    setModalOpen(true);
  };

  const showTutorialModal = () => {
    if (!isMobile) {
      setModalEmoji(null);
      setModalTitle("Tutoriel");
      setModalContent(
        <iframe
          className="mx-auto w-5xl "
          width="1200"
          height="600"
          src="https://www.youtube.com/embed/xcrQ8a4zAnY"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      );

      setButtons(
        <Button
          onClick={() => setModalOpen(false)}
          color="ring-green-200 text-white hover:bg-green-700 active:bg-green-900 bg-green-600"
        >
          J'ai compris !
        </Button>
      );
      setModalWidth("max-w-full");
      setModalOpen(true);
    } else {
      window.open("https://youtu.be/xcrQ8a4zAnY", "_blank");
    }
  };

  // Fonction de fermeture de la boite de dialogue
  const closeModal = () => setModalOpen(false);

  // Fonction d'ouverture du classement complet
  const openLeaderboardModal = () => {
    setModalEmoji(null);
    setModalTitle("Classement");
    setModalContent(<Leaderboard />);

    setButtons(
      <Button
        onClick={() => setModalOpen(false)}
        color="ring-green-200 text-white hover:bg-green-700 active:bg-green-900 bg-green-600"
      >
        C'est noté !
      </Button>
    );
    setModalWidth("sm:max-w-lg sm:w-full");
    setModalOpen(true);
  };

  return (
    <div className="w-auto md:w-4/12 rounded-xl bg-white shadow-md p-6 mx-auto flex flex-col justify-center gap-3">
      <Modal
        open={modalOpen}
        emoji={modalEmoji}
        title={modalTitle}
        buttons={Buttons}
        onClose={closeModal}
        paddingY={"py-4"}
        maxW={modalWidth}
      >
        {modalContent}
      </Modal>

      <img
        src="/logo512.png"
        className="h-36 w-36 mx-auto"
        alt="Morphocards Logo"
      />

      <h1 className="text-4xl text-gray-900 text-center">
        <span className="font-extrabold">Morpho</span>
        <TextAnimation>cards</TextAnimation>
      </h1>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-center text-gray-800">
          Jouer à Morphocards vous permet de comprendre ce qu'est la dyslexie !
        </p>
        <button onClick={showInfoModal}>
          <InformationCircleIcon className="h-6 w-6 text-gray-600 hover:text-indigo-400 active:text-indigo-600  " />
        </button>
      </div>

      <div className="flex items-center justify-center mt-5 h-20">
        <Button
          onClick={props.play}
          color="bg-indigo-500 text-white ring-indigo-200 hover:bg-indigo-400 active:bg-indigo-800"
          paddingY="py-4 hover:px-6 my-1 hover:my-0 hover:py-5"
          textSize="text-lg"
        >
          <div className="flex-1"></div>
          Jouer
          <div className="flex-1 flex justify-end">
            <ArrowRightIcon className="h-8 w-8" />
          </div>
        </Button>
      </div>

      <Button
        onClick={showTutorialModal}
        color="bg-indigo-500 text-indigo-500 bg-opacity-10 ring-indigo-200 hover:bg-opacity-20 active:bg-opacity-30"
        textSize="text-lg"
      >
        <div className="flex-1"></div>
        Tutoriel
        <div className="flex-1 flex justify-end">
          <AcademicCapIcon className="h-6 w-6" />
        </div>
      </Button>

      <Button
        onClick={openLeaderboardModal}
        color="bg-indigo-500 text-indigo-500 bg-opacity-10 ring-indigo-200 hover:bg-opacity-20 active:bg-opacity-30"
        textSize="text-lg"
      >
        <div className="flex-1"></div>
        Classement
        <div className="flex-1 flex justify-end">
          <StarIcon className="h-6 w-6" />
        </div>
      </Button>

      <div className="mt-5">
        {props.isLogged ? (
          <div id="user" className="text-center grid gap-3">
            <p>
              Vous êtes connecté en tant que{" "}
              <span className="font-bold">
                {Firebase.auth.currentUser.displayName}
              </span>
            </p>
            <Button
              color="bg-indigo-500 hover:bg-opacity-20 active:bg-opacity-30 text-indigo-500 bg-opacity-10"
              onClick={props.goToList}
            >
              Voir vos résultats
            </Button>
            <button
              className="text-red-500 hover:text-red-400 active:text-red-600"
              onClick={() => {
                Firebase.logOut();
              }}
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div id="login">
            <p className="italic text-gray-500 text-center">
              Connectez vous pour enregistrer vos parties et entrer dans le
              classement !
            </p>
            <StyledFirebaseAuth
              uiConfig={Firebase.uiConfig}
              firebaseAuth={Firebase.auth}
            />
          </div>
        )}
      </div>
    </div>
  );
}
