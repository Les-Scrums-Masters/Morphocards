import React, { Fragment, useState } from 'react'


/**
 * Boîte de dialogue : la boîte de dialogue qui apparait par dessus l'écran principal
 *
 * @component Modal
 *
 * @param   {bool} open  Etat du modal (ouvert/fermé)
 * @param   {string} emoji  Emoji affiché dans la boîte de dialogue
 * @param   {string} title   Titre affiché dans la boîte de dialgoue
 * @param   {Button[]} buttons  Liste de boutons a mettre dans la boîte de dialogue
 * @param   {function} onClose  Référence du composant
 *
 * @example
 * <Modal open={modalOpen} emoji={modalEmoji} title={modalTitle} buttons={Buttons} onClose={closeModal}>
 *     //modalContent
 * </Modal>
 *
 * @return {JSX} Le rendu jsx de la main
 */
function Notification(props) {

  return (

    props.open === true
    ?
    (

    <div className="pl-3 w-64 bg-white rounded-md drop-shadow-xl border-2 border-red-500 absolute right-10 bottom-1/4 p-4">
    <div className="flex items-center justify-between w-full">
        <p className="text-sm leading-none">
            <span className="text-red-500 text-bold">Alert :</span> Vous devez remplir toutes les cases en priorité
        </p>
        <button className="cursor-pointer" onClick={ props.closeNotification }>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 3.5L10.5 10.5" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
      </div>
      <p className="text-xs leading-3 pt-1 text-gray-500">Remplissez tous les emplacements</p>
  </div>
  )
    : ""
  );

}

export default Notification;
