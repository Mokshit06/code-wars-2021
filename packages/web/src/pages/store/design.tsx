import { useStorePages } from '@/hooks/store';
import { Box, Flex } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { Page, PageType } from '@prisma/client';
import React, { useRef, useState } from 'react';
import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings';

const EXT_TO_LANG = {
  '.hbs': 'handlebars',
};

export default function StoreDesign() {
  const { data: pages } = useStorePages();
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.HOME_PAGE);

  return (
    <Flex>
      {pages?.length ? (
        <>
          <FileMenu
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pages={pages}
          />
          <Editor page={pages.find(p => p.type === currentPage)!} />
        </>
      ) : (
        <Box></Box>
      )}
    </Flex>
  );
}

function Editor({ page }: { page: Page }) {
  return (
    <MonacoEditor
      language="typescript"
      value={page.rawJs}
      // width="50vw"
      height="50vh"
      theme="vs-dark"
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
}: {
  pages: Page[];
  setCurrentPage: React.Dispatch<React.SetStateAction<PageType>>;
  currentPage: PageType;
}) {
  return (
    <Flex direction="column">
      {pages.map(page => (
        <Box key={page.type} onClick={() => setCurrentPage(page.type)}>
          {page.type}
        </Box>
      ))}
    </Flex>
  );
}
