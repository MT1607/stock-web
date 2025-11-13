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
import useDebounce from '@/hooks/use-debounce';
import { useGetStockUS, useSearchStockUS } from '@/hooks/use-finhub';
import { Stock } from '@/types';
import { ChevronDown, Delete, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface DropdownListStockProps {
  valueStockFollow: string[];
  setValueStockFollow: React.Dispatch<React.SetStateAction<string[]>>;
}

const DropdownListStock = ({
  valueStockFollow,
  setValueStockFollow,
}: DropdownListStockProps) => {
  const {
    paginatedData: listStock,
    isLoading,
    setSize,
    size,
    isError: er,
  } = useGetStockUS();
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounce(search, 300);

  const { searchData, isSearchLoading } = useSearchStockUS(searchDebounced);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!listData.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % listData.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev <= 0 ? listData.length - 1 : prev - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0) {
          const stock = listData[highlightIndex];
          setValueStockFollow((prev) =>
            prev.includes(stock.symbol)
              ? prev.filter((s) => s !== stock.symbol)
              : [...prev, stock.symbol]
          );
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearch('');
        setHighlightIndex(-1);
        break;
      case 'Backspace':
        if (search === '') {
          setHighlightIndex(-1);
        }
        break;
      default:
        break;
    }
  };

  const listData = useMemo<Stock[]>(() => {
    if (searchData?.result && searchData.result.length > 0) {
      return searchData.result;
    }
    return listStock;
  }, [searchData, listStock]);

  return (
    <DropdownMenu>
      <InputGroup>
        <InputGroupInput
          placeholder="Select your stock ..."
          value={valueStockFollow.join(', ')}
          disabled
        />
        <InputGroupAddon
          align={'inline-end'}
          onClick={() => setValueStockFollow([])}
          visible={valueStockFollow.length > 0}
          className="cursor-pointer text-red-500"
        >
          <Delete />
        </InputGroupAddon>
        <DropdownMenuTrigger asChild>
          <InputGroupAddon
            align={'inline-end'}
            className="hover:cursor-pointer"
          >
            <ChevronDown />
          </InputGroupAddon>
        </DropdownMenuTrigger>
      </InputGroup>

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
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightIndex(-1);
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                handleKeyDown(e);
              }}
            />
            <InputGroupAddon align="inline-end">
              {search ? (
                <X
                  className="cursor-pointer"
                  size={16}
                  onClick={() => setSearch('')}
                />
              ) : (
                <Search size={16} />
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Khu vực scroll cho danh sách */}
        <ScrollArea className="h-[320px] w-full flex-1">
          {isLoading || isSearchLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader />
            </div>
          ) : listData.length > 0 ? (
            listData.map((stock, index) => {
              const isSelected = valueStockFollow.includes(stock.symbol);
              const isHighlighted = index === highlightIndex;
              return (
                <DropdownMenuItem
                  key={stock.symbol}
                  variant="highlight"
                  onSelect={(e) => {
                    e.preventDefault();
                    setValueStockFollow((prev) =>
                      prev.includes(stock.symbol)
                        ? prev.filter((s) => s !== stock.symbol)
                        : [...prev, stock.symbol]
                    );
                  }}
                  className={`flex justify-between ${
                    isHighlighted ? 'text-accent-foreground !bg-blue-400' : ''
                  }`}
                >
                  <span>{stock.symbol}</span>
                  {isSelected && <span className="text-green-500">✓</span>}
                </DropdownMenuItem>
              );
            })
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
