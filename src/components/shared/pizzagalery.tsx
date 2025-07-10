import React, { useEffect, useState } from 'react';

interface Topping {
  type: string;
  price: number;
}

interface Size {
  type: string;
  price: number;
}

interface Pizza {
  id: string;
  name: string;
  description: string;
  img: string;
  sizes: Size[];
  toppings?: Topping[];
}

export const PizzaGallery = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  useEffect(() => {
    fetch('https://shift-intensive.ru/api/pizza/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPizzas(data.catalog);
        }
      })
      .catch((err) => {
        console.error('Ошибка при получении пицц:', err);
      });
  }, []);

  const handleToppingChange = (topping: Topping, checked: boolean) => {
    if (checked) {
      setSelectedToppings((prev) => [...prev, topping]);
    } else {
      setSelectedToppings((prev) =>
        prev.filter((t) => t.type !== topping.type)
      );
    }
  };

  const getBasePrice = () => {
    if (!selectedPizza || !selectedSize) return 0;
    const sizePrice = selectedPizza.sizes.find(
      (s) => s.type === selectedSize
    )?.price || 0;
    const toppingsPrice = selectedToppings.reduce(
      (sum, t) => sum + t.price,
      0
    );
    return sizePrice + toppingsPrice;
  };

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-80 mt-6">
        {pizzas.map((pizza) => (
          <div
            key={pizza.id}
            className="bg-white shadow rounded-lg overflow-hidden p-4 text-left flex flex-col"
          >
            <img
              src={`/static/images/pizza/${pizza.id}.webp`}
              alt={pizza.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{pizza.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{pizza.description}</p>
            {pizza.sizes?.[0] && (
              <p className="text-base font-bold text-black mb-4">
                от {pizza.sizes[0].price} ₽
              </p>
            )}
            <button
              className="mt-auto text-white font-semibold py-2 px-4 rounded-2xl"
              style={{ backgroundColor: '#F4511E' }}
              onClick={() => {
                setSelectedPizza(pizza);
                setSelectedSize(pizza.sizes?.[0]?.type || '');
                setSelectedToppings([]);
              }}
            >
              Выбрать
            </button>
          </div>
        ))}
      </section>

      {selectedPizza && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedPizza(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-black rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <img
              src={`/static/images/pizza/${selectedPizza.id}.webp`}
              alt={selectedPizza.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{selectedPizza.name}</h2>
            <p className="text-gray-600 mb-4">{selectedPizza.description}</p>

            <div className="mb-4">
              <p className="font-semibold mb-2">Выберите размер:</p>
              {selectedPizza.sizes.map((size) => (
                <label key={size.type} className="block mb-1">
                  <input
                    type="radio"
                    name="size"
                    value={size.type}
                    checked={selectedSize === size.type}
                    onChange={() => setSelectedSize(size.type)}
                    className="mr-2"
                  />
                  {size.type} — {size.price} ₽
                </label>
              ))}
            </div>

            {selectedPizza.toppings && selectedPizza.toppings.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Добавить по вкусу:</p>
                {selectedPizza.toppings.map((topping) => (
                  <label key={topping.type} className="block">
                    <input
                      type="checkbox"
                      checked={selectedToppings.some((t) => t.type === topping.type)}
                      onChange={(e) =>
                        handleToppingChange(topping, e.target.checked)
                      }
                      className="mr-2"
                    />
                    {topping.type} (+{topping.price} ₽)
                  </label>
                ))}
              </div>
            )}

            <button
              className="w-full text-white font-semibold py-2 px-4 rounded-2xl"
              style={{ backgroundColor: '#F4511E' }}
              onClick={() => {
                alert(`Добавлено в корзину! Общая цена: ${getBasePrice()} ₽`);
                setSelectedPizza(null);
              }}
            >
              Добавить в корзину — {getBasePrice()} ₽
            </button>
          </div>
        </div>
      )}
    </>
  );
};