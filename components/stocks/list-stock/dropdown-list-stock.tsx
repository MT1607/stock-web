import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetStockUS } from '@/hooks/use-finhub';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

const DropdownListStock = () => {
  const {
    paginatedData: listStock,
    isLoading,
    setSize,
    size,
    isError: er,
  } = useGetStockUS();
  const [search, setSearch] = useState('');

  const filteredList = listStock.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroup>
          <InputGroupInput
            placeholder="Select your stock ..."
            className="hover:cursor-pointer"
          />
          <InputGroupAddon align={'inline-end'}>
            <ChevronDown />
          </InputGroupAddon>
        </InputGroup>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex h-[420px] w-full flex-col overflow-y-hidden p-2"
        align="end"
      >
        {/* Ô search cố định */}
        <div className="bg-background sticky top-0 z-10 mb-2">
          <InputGroup>
            <InputGroupInput
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <InputGroupAddon align={'inline-end'}>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Khu vực scroll cho danh sách */}
        <ScrollArea className="h-[320px] w-full flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader />
            </div>
          ) : filteredList.length > 0 ? (
            filteredList.map((stock) => (
              <DropdownMenuItem
                key={stock.symbol}
                onSelect={(e) => {
                  e.preventDefault();
                  console.log('Selected stock:', stock.symbol);
                }}
              >
                {stock.symbol}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-muted-foreground flex items-center justify-center py-4 text-sm">
              No result
            </div>
          )}
        </ScrollArea>

        <div className="border-border bg-background sticky bottom-0 z-10 mt-2 flex justify-center border-t pt-2">
          <Button
            onClick={() => setSize(size + 1)}
            variant="outline"
            disabled={er || isLoading}
            className="w-full" // Thêm w-full để nút rộng hơn
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownListStock;
