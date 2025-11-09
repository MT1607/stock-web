import Loader from '@/components/loader';
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

const DropdownListStock = () => {
  const {
    paginatedData: listStock,
    isLoading,
    totalItems,
    totalPages,
  } = useGetStockUS();

  console.log('list stock: ', listStock);

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
        className="h-[300px] w-full overflow-y-hidden"
        align="end"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <InputGroup>
              <InputGroupInput placeholder="Search ..." />
              <InputGroupAddon align={'inline-end'}>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </DropdownMenuItem>
          <ScrollArea className="h-[500px] w-full">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {listStock.length > 0 ? (
                  <div className="flex flex-col">
                    {listStock.map((stock) => (
                      <DropdownMenuItem
                        key={stock.symbol}
                        onSelect={(e) => {
                          console.log(stock.symbol);
                          e.preventDefault();
                        }}
                      >
                        {stock.symbol}
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <span className="w-full text-center">No result</span>
                )}
              </>
            )}
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownListStock;
