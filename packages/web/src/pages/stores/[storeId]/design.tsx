import { useStorePages } from '@/hooks/store';
import { Box, Flex, useToast } from '@chakra-ui/react';
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
  const router = useRouter();
  const toast = useToast();
  const storeId = router.query.storeId as string;
  const { data: initialPages = [], isLoading } = useStorePages(storeId);
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
  const handleChangeFile = (pageType: PageType, file: PageFile) => {
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

  if (isLoading || !currentPage) {
    return null;
  }

  return (
    <Flex>
      {initialPages?.length ? (
        <>
          <FileMenu pages={pages} onFileChange={handleChangeFile} />
          <Editor page={currentPage} file={currentFile} onSave={handleSave} />
        </>
      ) : (
        <Box></Box>
      )}
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
      height="50vh"
      theme="vs-dark"
      path={`${page?.type}/${file}`}
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
        });
      }}
    />
  );
}

function FileMenu({
  pages,
  onFileChange,
}: {
  pages: EditorPage[];
  onFileChange: (pageType: PageType, file: PageFile) => void;
}) {
  return (
    <Flex>
      {pages.map(page => (
        <Box key={page.type} width="12rem">
          <Box>{PAGE_TYPE_TO_NAME[page.type]}</Box>
          <Box pl="2rem">
            {Object.keys(FILE_TO_LANG).map(file => (
              <Box
                key={file}
                onClick={() => onFileChange(page.type, file as PageFile)}
              >
                {file}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Flex>
  );
}
