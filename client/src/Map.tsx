import React, { useState } from 'react';

type Animal = {
  id: number;
  name: string;
  imageUrl?: string;
  position: number;
};

type Props = {
  animals: Animal[];
  badgerImageUrl?: string;
  forestImageUrl?: string;
};

export default function Map({
  animals,
  badgerImageUrl,
  forestImageUrl,
}: Props) {
  const [badgerX, setBadgerX] = useState(0);

  const sceneWidth = 2000;
  const sceneHeight = 300;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: forestImageUrl
          ? `url(${forestImageUrl}) center/cover repeat-x`
          : '#14532d',
        borderRadius: 16,
        boxShadow: '0 0 16px #0008',
        overflow: 'hidden',
      }}
    >
      <img
        src={badgerImageUrl || '/badger.png'}
        alt="Badger"
        style={{
          position: 'absolute',
          left: badgerX,
          bottom: 10,
          width: 48,
          height: 48,
          zIndex: 2,
        }}
      />

      {animals.map(animal => (
        <img
          key={animal.id}
          src={animal.imageUrl || '/animal.png'}
          alt={animal.name}
          title={animal.name}
          style={{
            position: 'absolute',
            left: animal.position,
            bottom: 10,
            width: 40,
            height: 40,
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}