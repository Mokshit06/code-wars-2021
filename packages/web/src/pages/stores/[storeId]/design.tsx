import { useStorePages } from '@/hooks/store';
import { Box, Flex } from '@chakra-ui/react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { Page, PageType } from '@prisma/client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings';
import { useRouter } from 'next/router';
import type { editor } from 'monaco-editor';

type PageFile = 'template.hbs' | 'style.css' | 'script.tsx';

const FILE_TO_LANG: Record<PageFile, string> = {
  'template.hbs': 'handlebars',
  'style.css': 'css',
  'script.tsx': 'typescript',
};

const FILE_TO_FIELD: Record<PageFile, keyof Page> = {
  'template.hbs': 'rawTemplate',
  'script.tsx': 'rawJs',
  'style.css': 'css',
};

const PAGE_TYPE_TO_NAME: Record<PageType, string> = {
  CART_PAGE: 'Cart',
  HOME_PAGE: 'Home',
  PRODUCTS_LIST_PAGE: 'Products List',
  SINGLE_PRODUCT_PAGE: 'Single Product',
};

export default function StoreDesign() {
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: pages } = useStorePages(storeId);
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.HOME_PAGE);

  const [currentFile, setCurrentFile] = useState<PageFile>('template.hbs');

  return (
    <Flex>
      {pages?.length ? (
        <>
          <FileMenu
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pages={pages}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
          />
          <Editor
            page={pages.find(p => p.type === currentPage)!}
            currentFile={currentFile}
          />
        </>
      ) : (
        <Box></Box>
      )}
    </Flex>
  );
}

function Editor({ page, currentFile }: { page: Page; currentFile: PageFile }) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!editorRef.current) return;

      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        editorRef.current.getAction('editor.action.formatDocument').run();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <MonacoEditor
      language={FILE_TO_LANG[currentFile]}
      defaultValue={page[FILE_TO_FIELD[currentFile]] as string}
      // width="50vw"
      height="50vh"
      theme="vs-dark"
      path={`${page.type}/${currentFile}`}
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
  setCurrentPage,
  currentPage,
  currentFile,
  setCurrentFile,
}: {
  pages: Page[];
  setCurrentPage: React.Dispatch<React.SetStateAction<PageType>>;
  currentPage: PageType;
  currentFile: PageFile;
  setCurrentFile: React.Dispatch<React.SetStateAction<PageFile>>;
}) {
  return (
    <Flex>
      {pages.map(page => (
        <Box key={page.id} width="12rem">
          <Box>{PAGE_TYPE_TO_NAME[page.type]}</Box>
          <Box pl="2rem">
            {Object.keys(FILE_TO_LANG).map(file => (
              <Box key={file} onClick={() => setCurrentFile(file as PageFile)}>
                {file}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Flex>
  );
}
