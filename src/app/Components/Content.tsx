import React from 'react'

type ContentProps = {
  chatOpened: Boolean;
};

const Content: React.FC<ContentProps> = ({ chatOpened }) => {
  return (
    <div className={`min-h-[100vh] pt-10 bg-gray-700 ${chatOpened ? 'w-[75vw]' : 'w-[100vw]'} transition-width duration-500 `}>
        Main Content
    </div>
  )
}

export default Content