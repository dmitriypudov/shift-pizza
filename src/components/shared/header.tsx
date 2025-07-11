import { cn } from '../../lib/utils';
import React from 'react';
import { Container } from './container';
import { Button } from '../ui';
import { Clock, Moon, MoonIcon, ShoppingCart, User } from 'lucide-react';

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
<header className={cn('border border-b ', className)}>
  <Container className="flex items-center justify-between py-8">
    
    {/* Левая часть: логотип + кнопки */}
    <div className="flex items-center gap-6">
      <img src="/Logo.png" alt="Logo" width={135} height={135} />

      <div className="flex items-center gap-2">
        <Button variant="secondary" className="gap-1">
          <User size={16} /> Профиль
        </Button>
        <Button variant="secondary" className="gap-1">
          <Clock size={16} /> Заказы
        </Button>
      </div>
    </div>

    {/* Правая часть: корзина */}
    <div className="flex items-center gap-1">
      <Button variant="secondary" className="flex items-center gap-3">
        <ShoppingCart size={16} /> Корзина
      </Button>
       <Moon color="gray" />
    </div>

  </Container>
</header>
  );
};
