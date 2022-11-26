import React, { ReactElement } from 'react';
import { AvatarProps } from '../interfaces';

const Avatar: React.FC<AvatarProps> = (AvatarProps): ReactElement => {
   let { src, className, alt, size, border } = AvatarProps;

   // filter out size
   size = size === 'sm' ? 'h-[25px] w-[25px]' : size === 'md' ? 'h-[50px] w-[50px]' : 'h-[100px] w-[100px]';

   return (
      <div className={`${className} profile rounded-full overflow-hidden bg-red-100 flex items-center justify-center ${size} border-${border} border-green-500`}>
         <img src={src} className={`${className} h-fit w-fit`} alt={alt} />
      </div>
   )
}

export default Avatar;
