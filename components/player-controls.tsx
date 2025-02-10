import { cn } from '@/lib/utils';
import { IconLayoutNavbarCollapse } from '@tabler/icons-react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState, memo } from 'react';

export const PlayerControls = ({
  items,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl bg-gray-50/60 dark:bg-neutral-900/60 backdrop-blur-md backdrop-saturate-150 border border-gray-200/20 dark:border-neutral-800/20 px-4 pb-3',
      )}
    >
      {items.map((item, idx) => (
        <IconContainer
          mouseX={mouseX}
          key={`player-control-${idx}`}
          {...item}
        />
      ))}
    </motion.div>
  );
};

const IconContainer = memo(
  function IconContainer({
    mouseX,
    title,
    icon,
    onClick,
  }: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) {
    let ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    let distance = useTransform(mouseX, (val) => {
      let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

      return val - bounds.x - bounds.width / 2;
    });

    let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    let widthTransformIcon = useTransform(
      distance,
      [-150, 0, 150],
      [20, 40, 20],
    );
    let heightTransformIcon = useTransform(
      distance,
      [-150, 0, 150],
      [20, 40, 20],
    );

    let width = useSpring(widthTransform, {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    });
    let height = useSpring(heightTransform, {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    });

    let widthIcon = useSpring(widthTransformIcon, {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    });
    let heightIcon = useSpring(heightTransformIcon, {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    });

    return (
      <motion.button
        onClick={onClick}
        className='bg-transparent'
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <motion.div
          ref={ref}
          style={{ width, height }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className='aspect-square rounded-full bg-transparent dark:bg-neutral-800 flex items-center justify-center relative'
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 2, x: '-50%' }}
                className='px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs'
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{ width: widthIcon, height: heightIcon }}
            className='flex items-center justify-center'
          >
            {icon}
          </motion.div>
        </motion.div>
      </motion.button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.mouseX === nextProps.mouseX &&
      prevProps.onClick === nextProps.onClick
    );
  },
);
