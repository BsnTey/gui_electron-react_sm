import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, EditIcon } from '@chakra-ui/icons';
import ModalSettings from './ModalSettings';

export const MenuSettings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onHandlerOpenModalSettings = () => {
    onOpen();
  };

  return (
    <>
      <ModalSettings isOpen={isOpen} onClose={onClose} />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
          position="absolute"
          top="10px"
          left="10px"
        />
        <MenuList>
          <MenuItem icon={<EditIcon />} onClick={onHandlerOpenModalSettings}>
            Настройки
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
