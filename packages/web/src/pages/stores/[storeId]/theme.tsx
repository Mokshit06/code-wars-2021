import { useChangeTheme, useStore, useStorePages } from '@/hooks/store';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Tag,
  useToast,
  VStack,
} from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { PageType } from '@prisma/client';
import type { editor } from 'monaco-editor';
import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type EditorPage = {
  'template.hbs': string;
  'style.css': string;
  'script.tsx': string;
  type: PageType;
};
type PageFile = 'template.hbs' | 'style.css' | 'script.tsx';

const FILE_TO_LANG: Record<PageFile, string> = {
  'template.hbs': 'handlebars',
  'style.css': 'css',
  'script.tsx': 'typescript',
};

const PAGE_TYPE_TO_NAME: Record<PageType, string> = {
  CART_PAGE: 'Cart',
  HOME_PAGE: 'Home',
  PRODUCTS_LIST_PAGE: 'Products List',
  SINGLE_PRODUCT_PAGE: 'Single Product',
};

export default function StoreDesign() {
  const toast = useToast();
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: initialPages, isLoading } = useStorePages(storeId);
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [currentPageType, setCurrentPageType] = useState<PageType>(
    PageType.HOME_PAGE
  );
  const currentPage = pages.find(p => p.type === currentPageType);
  const [currentFile, setCurrentFile] = useState<PageFile>('template.hbs');
  const handleSave = useCallback(
    (value: string) => {
      setPages(pages =>
        pages.map(page => {
          if (page.type === currentPageType) {
            return { ...page, [currentFile]: value };
          }

          return page;
        })
      );

      toast({
        title: 'File saved',
        description: `${currentFile} has been saved!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    [currentFile, currentPageType, toast]
  );
  const handleChangeFile: FileMenuProps['onFileChange'] = (pageType, file) => {
    setCurrentPageType(pageType);
    setCurrentFile(file);
  };

  useEffect(() => {
    if (!initialPages) return;

    setPages(
      initialPages.map(page => ({
        'template.hbs': page.rawTemplate,
        'style.css': page.css,
        'script.tsx': page.rawJs,
        type: page.type,
      }))
    );
  }, [initialPages]);

  if (isLoading) {
    return null;
  }

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      {initialPages?.length ? (
        currentPage ? (
          <Flex boxShadow="md" rounded="md">
            <FileMenu
              currentFile={currentFile}
              currentPageType={currentPageType}
              pages={pages}
              onFileChange={handleChangeFile}
            />
            <Editor page={currentPage} file={currentFile} onSave={handleSave} />
          </Flex>
        ) : null
      ) : (
        <ThemePicker />
      )}
    </Flex>
  );
}

function ThemePicker() {
  const [theme, setTheme] = useState<'default' | 'custom'>('default');
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: store } = useStore(storeId);
  const changeTheme = useChangeTheme(storeId);
  const toast = useToast();

  useEffect(() => {
    if (changeTheme.isSuccess) {
      toast({
        title: 'Theme updated',
        description: `${store?.name}'s theme has been updated!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [changeTheme.isSuccess, toast, store]);

  return (
    <Flex direction="column">
      <Box mb={6}>
        <Heading fontWeight="500">Choose theme</Heading>
      </Box>
      <Flex alignItems="center" justifyContent="space-evenly">
        <Button onClick={() => setTheme('default')}>Default</Button>
        <Button onClick={() => setTheme('custom')}>Custom</Button>
      </Flex>
      <Box mt={6} width="100%" textAlign="right">
        <Button
          isLoading={changeTheme.isLoading}
          onClick={() => changeTheme.mutate(theme)}
        >
          Add Theme
        </Button>
      </Box>
    </Flex>
  );
}

function Editor({
  file,
  page,
  onSave,
}: {
  file: PageFile;
  page: EditorPage;
  onSave: (val: string) => void;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState(page[file]);

  useEffect(() => {
    setValue(page[file]);
  }, [file, page]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!editorRef.current) return;

      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        editorRef.current.getAction('editor.action.formatDocument').run();
        onSave(value);
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [value, onSave]);

  return (
    <MonacoEditor
      language={FILE_TO_LANG[file]}
      value={value}
      onChange={value => setValue(value || '')}
      height="60vh"
      width="60vw"
      theme="vs-dark"
      path={`inmemory://model/${page.type}/${file}.tsx`}
      beforeMount={monaco => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSyntaxValidation: true,
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          jsx: monaco.languages.typescript.JsxEmit.React,
          jsxFactory: 'React.createElement',
          allowNonTsExtensions: true,
          allowJs: true,
          target: monaco.languages.typescript.ScriptTarget.Latest,
        });
      }}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        (AutoTypings as any).create(monaco, editor, {
          sourceCache: new LocalStorageCache(),
          debounceDuration: 2000,
          packageRecursionDepth: 10,
        });
      }}
    />
  );
}

type FileMenuProps = {
  pages: EditorPage[];
  currentPageType: PageType;
  onFileChange: (pageType: PageType, file: PageFile) => void;
  currentFile: PageFile;
};

function FileMenu({
  pages,
  onFileChange,
  currentFile,
  currentPageType,
}: FileMenuProps) {
  return (
    <Box overflow="auto" height="60vh" w="15vw" minWidth="10rem">
      <Box p="4" bg="gray.50" borderTopLeftRadius="md">
        <Heading as="h3" fontSize="xl" fontWeight="500">
          Pages
        </Heading>
      </Box>
      <Divider />
      <VStack spacing={2} w="full" alignItems="flex-start" p="3">
        {pages.map(page => (
          <Folder
            currentFile={currentFile}
            currentPageType={currentPageType}
            page={page}
            key={page.type}
            onFileChange={onFileChange}
          />
        ))}
      </VStack>
    </Box>
  );
}

type FolderProps = {
  page: EditorPage;
  currentPageType: PageType;
  onFileChange: FileMenuProps['onFileChange'];
  currentFile: PageFile;
};

function Folder({
  page,
  onFileChange,
  currentFile,
  currentPageType,
}: FolderProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box w="full">
      <Box p="1" w="full" cursor="pointer" onClick={() => setOpen(!open)}>
        {PAGE_TYPE_TO_NAME[page.type]}
      </Box>
      {open && (
        <Flex direction="column" mt="2" pl="4">
          {Object.keys(FILE_TO_LANG).map(file => (
            <Box
              cursor="pointer"
              key={file}
              py="0.5"
              px="1"
              rounded="sm"
              bg={
                file === currentFile && page.type === currentPageType
                  ? 'gray.100'
                  : 'white'
              }
              onClick={() => onFileChange(page.type, file as PageFile)}
            >
              {file}
            </Box>
          ))}
        </Flex>
      )}
      <Divider mt="2" />
    </Box>
  );
}
