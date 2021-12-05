import React, { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function Modal(props) {
  // const [open, setOpen] = useState(true)

  const nextBtnRef = useRef(null)

  let wrongContent = (props.wrongWord === '') ? "" : (
    <div className="mt-2">
      <p className="text-sm text-gray-500">Vous avez formé le mot</p>
      <p className="text-lg text-indigo-600 font-bold">{props.wrongWord}</p>
    </div>
  );

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={nextBtnRef} onClose={props.onClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                    <h1 className="text-6xl text-center mt-4"><span role='img' aria-label="emoji">{props.emoji}</span></h1>
                  <div className="mt-5 text-center">
                    <Dialog.Title as="h3" className="text-2xl leading-6 font-medium text-gray-900">
                      {props.title}
                    </Dialog.Title>
                    <div className="mt-6">
                      <p className="text-sm text-gray-500">
                        Le mot était</p>
                      <p className="text-lg text-indigo-600 font-bold">{props.word}</p>
                      {wrongContent}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 ">
                <button
                ref={nextBtnRef}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                  onClick={props.onClose}
                >
                  Passer au mot suivant
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}