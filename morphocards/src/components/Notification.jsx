import React from 'react'
import { Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline';

/**
 * Notification : la notification qui indique des informations au joueur
 *
 * @component Notification
 *
 * @param   {bool} open  Etat de la notification (ouvert/fermé)
 * @param   {function} closeNotification  Fonction pour faire disparaitre la notification
 *
 * @example
 * <Notification open={openNotification} closeNotification={closeNotification} />
 *
 * @return {JSX} Le rendu jsx de la notification
 */
function Notification(props) {

  return (


      <div>
      <Transition
        show={props.open}
        enter="transition-opacity duration-600"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-400"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
      <div className="w-96 bg-red-200 rounded-xl drop-shadow-xl absolute right-10 bottom-1/4 py-4 px-6 transition-all flex gap-2 items-center text-red-500">
          <p className="flex-1 font-bold">
              Veuillez remplir toutes les cases 
          </p>
          <button className="opacity-50 hover:opacity-100" onClick={ props.closeNotification }>
              <XIcon className='h-6 w-6'/>
          </button>
      </div>
      </Transition>
    </div>


  );

}

export default Notification;
